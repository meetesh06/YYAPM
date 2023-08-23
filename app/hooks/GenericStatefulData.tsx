// import { assert } from 'console';
import { useState } from 'react';


export const useGenericStatefulData = <T,ProgStates>() => {
  type StateAndData = {
    state: ProgStates | undefined,
    data: T | undefined
  };

  const [currentState, setCurrentState] = useState<StateAndData>({ state: undefined, data: undefined });

  const initializeState = (
    callback: (arg0: StateAndData) => StateAndData
  ) => {
    // Call initializer
    const callbackRes = callback(currentState);
    
    // // Assert the initializer sets a not default state
    // assert(callbackRes.state !== undefined);

    // Set initial state
    setCurrentState(callbackRes);
  }

  // The set of transitions
  const transitionHandler = (
      preAssertions: (arg0: StateAndData) => void,
      transition: (arg0: StateAndData) => StateAndData,
      postAssertions: (arg0: StateAndData) => void
      ) => {
    // Pre Assertions 
    preAssertions(currentState);

    // Transition
    const callbackRes: StateAndData = transition(currentState);

    // Post Assertions
    postAssertions(callbackRes)

    // Final Transition
    setCurrentState(callbackRes)
  }

  return {m_state: currentState, m_initializeState: initializeState, m_transitionHandler: transitionHandler}
}