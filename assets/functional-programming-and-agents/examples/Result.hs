module Result (Result(..)) where

data Result e a = Failed e | Succeeded a deriving (Eq, Show)

instance Functor (Result e) where
  fmap _ (Failed err) = Failed err
  fmap f (Succeeded x) = Succeeded (f x)

instance Applicative (Result e) where
  pure = Succeeded
  Failed err <*> _ = Failed err
  Succeeded f <*> result = fmap f result

instance Monad (Result e) where
  Failed err >>= _ = Failed err
  Succeeded x >>= next = next x
