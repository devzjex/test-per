import { combineReducers } from '@reduxjs/toolkit';
import myAppsReducer from './my-apps/MyApps';
import loginAppReducer from './auth/LoginApp';
import registerAppReducer from './auth/RegisterApp';
import onboardingStateReducer from './onboarding/OnboardingState';

const rootReducer = combineReducers({
  myApps: myAppsReducer,
  loginApp: loginAppReducer,
  registerApp: registerAppReducer,
  onboardingState: onboardingStateReducer,
});

export default rootReducer;
