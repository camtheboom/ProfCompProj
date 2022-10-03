import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createAppContainer } from "react-navigation";

import AutoLog from '../screens/AutoLog.js'
import ManualLog from '../screens/ManualLog.js'

const screens = {
    AutoLog: {
        screen: AutoLog
    },

    ManualLog: {
        screen: ManualLog
    }

}

const HomeStack = createNativeStackNavigator({screens});

export default createAppContainer(HomeStack);