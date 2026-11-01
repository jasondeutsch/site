module Main where

import Control.Monad (unless)
import Data.IORef
import Result
import Workflow

assertEqual :: (Eq a, Show a) => String -> a -> a -> IO ()
assertEqual label expected actual =
  unless (expected == actual) $
    error (label ++ ": expected " ++ show expected ++ ", got " ++ show actual)

-- In-memory stand-in for a remote service, NOT durable storage.
executeSimulated
  :: IORef [(OperationId, PullRequestId)] -> Bool
  -> PublishCommand -> IO PublishResult
executeSimulated remote loseResponse command = do
  let op = operationId command
  existing <- lookup op <$> readIORef remote
  pr <- case existing of
    Just found -> pure found
    Nothing -> do
      let created = PullRequestId 42
      modifyIORef' remote ((op, created) :)
      pure created
  pure $ if loseResponse then PublicationUnknown op else Published pr

main :: IO ()
main = do
  let rev = Revision "dependency-update-abc123"
      op = OperationId "update-example-001"
      policy = Policy "example/service" ["package.json", "package-lock.json"]
      proposal = ProposedPatch "example/service" rev ["package-lock.json"]
      report = CheckReport rev True True
      approval = Approval rev True
      prepared = preparePublication policy proposal report approval

  authorized <- case prepared of
    Left err -> error (show err)
    Right patch -> pure patch
  assertEqual "approved revision" rev (authorizedRevision authorized)
  putStrLn "success: dependency update authorized"

  assertEqual "scope rejection" (Left ScopeRejected)
    (preparePublication policy
      (proposal { changedFiles = ["secrets.txt"] }) report approval)
  assertEqual "failed checks" (Left ChecksFailed)
    (preparePublication policy proposal (report { testsPassed = False }) approval)
  assertEqual "stale checks" (Left StaleEvidence)
    (preparePublication policy proposal
      (report { checkedRevision = Revision "old" }) approval)
  assertEqual "missing approval" (Left ApprovalRequired)
    (preparePublication policy proposal report (approval { approvalGranted = False }))
  assertEqual "stale approval" (Left ApprovalRequired)
    (preparePublication policy proposal report
      (approval { approvedRevision = Revision "old" }))
  putStrLn "rejection: scope, checks, evidence, and approval cases passed"

  let result = Succeeded proposal :: Result String ProposedPatch
      continue patch = Succeeded (patchRevision patch) :: Result String Revision
      failed = Failed "stop" :: Result String ProposedPatch
  assertEqual "bind success" (Succeeded rev) (result >>= continue)
  assertEqual "bind skips continuation" (Failed "stop" :: Result String Revision)
    (failed >>= (\_ -> error "must not evaluate continuation"))
  assertEqual "left identity" (continue proposal) (pure proposal >>= continue)
  assertEqual "right identity" result (result >>= pure)
  let finish r = Succeeded (show r) :: Result String String
  assertEqual "associativity" ((result >>= continue) >>= finish)
    (result >>= (\x -> continue x >>= finish))
  putStrLn "monad: sequencing and representative law checks passed"

  remote <- newIORef []
  outcome <- executeSimulated remote True (planPublication op authorized)
  assertEqual "lost response" (PublicationUnknown op) outcome
  let history = [Started op, TimedOut op]
  assertEqual "uncertain history" (Right (Uncertain op)) (replay history)
  recovered <- recoverPublication
    (\key -> maybe NotFound Found . lookup key <$> readIORef remote) op
  assertEqual "recovered publication" (Resolved (PullRequestId 42)) recovered
  assertEqual "resolved history" (Right (Complete op (PullRequestId 42)))
    (replay (history ++ [Confirmed op (PullRequestId 42)]))
  stored <- readIORef remote
  assertEqual "no duplicate publication" 1 (length stored)
  putStrLn "timeout: reconciled one existing pull request without another create"

  unresolved <- recoverPublication (\_ -> pure NotFound) op
  assertEqual "not found is uncertain" (NeedsReconciliation op) unresolved
  unavailable <- recoverPublication (\_ -> pure (LookupUnavailable "offline")) op
  assertEqual "lookup failure is uncertain" (NeedsReconciliation op) unavailable
  assertEqual "reject mismatched operation" (Left "Invalid publication transition")
    (replay [Started op, Confirmed (OperationId "other") (PullRequestId 42)])
  putStrLn "recovery: unresolved lookups stay pending; mismatched events rejected"
  putStrLn "All scenario checks passed. No network calls were made."
