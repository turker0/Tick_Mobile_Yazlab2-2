import React from "react";
import DeviceInfo from "react-native-device-info";
import Icon from "react-native-vector-icons/Ionicons";


import {
  View,
  Button,
  Text,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: "",
      new: {
        title: "",
        content: "",
        category: [],
        date: 0,
        stats: {
          like: 0,
          dislike: 0,
          views: 0
        }
      }
    };
  }

  getNew(slug) {
    req("/view/" + slug, "GET", null, res => {
      this.setState({
        new: res
      });
    });
  }

  /* https://facebook.github.io/react-native/docs/network */
  vote(diff) {
    req(
      "/vote",
      "POST",
      JSON.stringify({
        /* https://aboutreact.com/react-native-get-unique-id-of-device/ */
        userid: this.state.deviceId,
        slug: this.state.new.slug,
        diff
      }),
      res => {
        this.setState({
          new: {
            ...this.state.new,
            stats: res
          }
        });
      }
    );
  }

  componentDidMount() {
    var id = DeviceInfo.getUniqueID();
    this.setState({ deviceId: id });
    this.props.navigation.addListener("willFocus", payload => {
      let { slug } = payload.state.params;
      this.getNew(slug);
    });
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerTitleStyle: { textAlign: "center", alignSelf: "center" , fontWeight: '400', },
    headerStyle: {
      backgroundColor: "white", height: 50,
    }
  });

  render() {
    return (
      <View>
        <ScrollView style={styles.scroll}>
          <Image
            resizeMode="cover"
            style={styles.postImage}
            source={{ uri: baseURL + this.state.new.image }}
          />
          <Text style={styles.postTitle}>{this.state.new.content}</Text>
        </ScrollView>


        <View style={styles.feedback}> 

          <Text 
          style={styles.stat}>
          {"View "}
          </Text>
          <Text 
          style={styles.numbers}>
          {this.state.new.stats.views}
          </Text>

       
          <Text 
          style={styles.stat}
          onPress={() => this.vote(+1)}>
            {"Like "}
          </Text>
          <Text  
          style={styles.numbers}
          onPress={() => this.vote(+1)}>
          {this.state.new.stats.like}
          </Text>

          <Text 
          style={styles.stat}
          onPress={() => this.vote(-1)}>
             {"Dislike "}
          </Text>
          <Text
          style={styles.numbers}
          onPress={() => this.vote(-1)}>
          {this.state.new.stats.dislike}
          </Text>
  
        </View>
        
      </View>
    );
  }
}



const styles = StyleSheet.create({
  scroll:{
    height: 480,
  },

  postImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#eff0f1",

  },
  postTitle: {
    padding: 20 , color: '#000307',
    borderTopColor: '#edeef1',
    borderTopWidth: 2,
    
  },

  feedback:{
    flexDirection: 'row',
    borderTopColor: '#edeef1',
    borderTopWidth: 2,
    padding:5,
    

  },

  stat:{
    fontSize: 15,
    color:'#999',
    marginLeft: 20,
    paddingLeft: 15,
    paddingRight: 3,
  },
  
  numbers:{
    color:'#555',
    paddingRight: 15,
  }





});
