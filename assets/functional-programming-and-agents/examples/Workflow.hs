module Workflow
  ( Revision(..), OperationId(..), PullRequestId(..)
  , ProposedPatch(..), Policy(..), CheckReport(..), Approval(..)
  , ScopedPatch, CheckedPatch, AuthorizedPatch, WorkflowError(..)
  , validateScope, acceptChecks, authorize, preparePublication
  , evidenceMatches, publicationAllowed, authorizedRevision
  , PublishCommand(..), planPublication, PublishResult(..)
  , PublishState(..), PublishEvent(..), step, replay
  , LookupResult(..), RecoveryDecision(..), recoverPublication
  ) where

import Control.Monad (foldM)

newtype Revision = Revision String deriving (Eq, Show)
newtype OperationId = OperationId String deriving (Eq, Show)
newtype PullRequestId = PullRequestId Int deriving (Eq, Show)

data ProposedPatch = ProposedPatch
  { patchRepository :: String, patchRevision :: Revision
  , changedFiles :: [FilePath]
  } deriving (Eq, Show)

data Policy = Policy
  { allowedRepository :: String, allowedFiles :: [FilePath]
  } deriving (Eq, Show)

data CheckReport = CheckReport
  { checkedRevision :: Revision, testsPassed :: Bool
  , securityPassed :: Bool
  } deriving (Eq, Show)

data Approval = Approval
  { approvedRevision :: Revision, approvalGranted :: Bool
  } deriving (Eq, Show)

-- Constructors stay private: callers use the validating functions.
newtype ScopedPatch = ScopedPatch ProposedPatch deriving (Eq, Show)
newtype CheckedPatch = CheckedPatch ScopedPatch deriving (Eq, Show)
newtype AuthorizedPatch = AuthorizedPatch CheckedPatch deriving (Eq, Show)

data WorkflowError
  = ScopeRejected | StaleEvidence | ChecksFailed | ApprovalRequired
  deriving (Eq, Show)

validateScope :: Policy -> ProposedPatch -> Either WorkflowError ScopedPatch
validateScope policy patch
  | patchRepository patch /= allowedRepository policy = Left ScopeRejected
  | not (all (`elem` allowedFiles policy) (changedFiles patch)) = Left ScopeRejected
  | otherwise = Right (ScopedPatch patch)

evidenceMatches :: Revision -> CheckReport -> Bool
evidenceMatches rev report = checkedRevision report == rev

acceptChecks :: ScopedPatch -> CheckReport -> Either WorkflowError CheckedPatch
acceptChecks scoped@(ScopedPatch patch) report
  | not (evidenceMatches (patchRevision patch) report) = Left StaleEvidence
  | not (testsPassed report && securityPassed report) = Left ChecksFailed
  | otherwise = Right (CheckedPatch scoped)

publicationAllowed :: Revision -> CheckReport -> Approval -> Bool
publicationAllowed rev report approval =
  evidenceMatches rev report
    && testsPassed report && securityPassed report
    && approvedRevision approval == rev && approvalGranted approval

authorize :: CheckedPatch -> Approval -> Either WorkflowError AuthorizedPatch
authorize checked@(CheckedPatch (ScopedPatch patch)) approval
  | approvedRevision approval /= patchRevision patch = Left ApprovalRequired
  | not (approvalGranted approval) = Left ApprovalRequired
  | otherwise = Right (AuthorizedPatch checked)

preparePublication
  :: Policy -> ProposedPatch -> CheckReport -> Approval
  -> Either WorkflowError AuthorizedPatch
preparePublication policy proposal report approval = do
  scoped <- validateScope policy proposal
  checked <- acceptChecks scoped report
  authorize checked approval

authorizedRevision :: AuthorizedPatch -> Revision
authorizedRevision (AuthorizedPatch (CheckedPatch (ScopedPatch patch))) =
  patchRevision patch

data PublishCommand = OpenPullRequest
  { operationId :: OperationId, repository :: String
  , revision :: Revision, title :: String
  } deriving (Eq, Show)

planPublication :: OperationId -> AuthorizedPatch -> PublishCommand
planPublication op (AuthorizedPatch (CheckedPatch (ScopedPatch patch))) =
  OpenPullRequest op (patchRepository patch) (patchRevision patch)
    "Update example dependency"

data PublishResult
  = Published PullRequestId
  | PublicationUnknown OperationId
  | PublicationFailed String
  deriving (Eq, Show)

data PublishState
  = Ready | InFlight OperationId | Uncertain OperationId
  | Complete OperationId PullRequestId
  deriving (Eq, Show)

data PublishEvent
  = Started OperationId | TimedOut OperationId
  | Confirmed OperationId PullRequestId
  deriving (Eq, Show)

step :: PublishState -> PublishEvent -> Either String PublishState
step Ready (Started op) = Right (InFlight op)
step (InFlight expected) (TimedOut op)
  | expected == op = Right (Uncertain op)
step (InFlight expected) (Confirmed op pr)
  | expected == op = Right (Complete op pr)
step (Uncertain expected) (Confirmed op pr)
  | expected == op = Right (Complete op pr)
step _ _ = Left "Invalid publication transition"

replay :: [PublishEvent] -> Either String PublishState
replay = foldM step Ready

data LookupResult = Found PullRequestId | NotFound | LookupUnavailable String
  deriving (Eq, Show)
data RecoveryDecision = Resolved PullRequestId | NeedsReconciliation OperationId
  deriving (Eq, Show)

recoverPublication
  :: (OperationId -> IO LookupResult) -> OperationId -> IO RecoveryDecision
recoverPublication lookupRemote op = do
  result <- lookupRemote op
  pure $ case result of
    Found pr -> Resolved pr
    NotFound -> NeedsReconciliation op
    LookupUnavailable _ -> NeedsReconciliation op
