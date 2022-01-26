import 'react-native-gesture-handler';

import React, { useEffect, useState} from 'react';
import { getUniqueId } from 'react-native-device-info';

import StartupScreen from './views/StartupScreen';
import RegisterScreen from './views/RegisterScreen';
import MainAppNavigator from './navigators/MainAppNavigator'

import axios from 'axios';
import { BuildNumber, checkExistingAccountPath, HOST } from './constants';
import BannedScreen from './views/BannedScreen';
import { Alert } from 'react-native';

const App = () => {
  const [currentComponentIndex, setCurrentComponentIndex] = useState(1);
  const [banned, setBanned] = useState(false);
  const [banReason, setBanReason] = useState(null);

  const componentDict = {
    1: <StartupScreen />,
    2: <RegisterScreen changeParentComponentIndex={setCurrentComponentIndex}/>,
    3: <MainAppNavigator />
  };

  const checkAccount = async () => {
    const result = await axios.get(`http://${HOST}/${checkExistingAccountPath}`, {
      params: {
        'userId': getUniqueId()
      }
    });

    if (result.data['BuildNumber'] > BuildNumber) {
      Alert.alert('New Version Available', 'You\'re using an old version of Tador.\nPlease update to the latest version!');
      return;
    }

    if (result.data['exists']) {
      if (result.data.banned == 1) {
        setBanned(true);
        setBanReason(result.data.banReason);
      } else setCurrentComponentIndex(3);
    } else {
      setCurrentComponentIndex(2);
    }
  };

  useEffect(() => {
    checkAccount();
  }, []);

  return banned? <BannedScreen banReason={banReason}/> : componentDict[currentComponentIndex];
}

export default App;