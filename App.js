import HomeScreen from './containers/List';
import Post from './containers/Post';

import {createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Post: {screen: Post},
});

const App = createAppContainer(MainNavigator);

export default App;