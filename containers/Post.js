import React from 'react';

import {
  Alert,
  View,
  Button,
  Text,
  ScrollView,
  Image
} from 'react-native';

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
      new: {
        title:"",
        content:"",
        category: [],
        date: 0,
        stats: {
          like:0,
          dislike:0,
          views:0
        }
      },
		};
  }
  
  baseURL = "https://tick.xava.me";

  getNew(slug) {
		fetch(this.baseURL+'/view/'+slug, {
			method: 'GET',
			headers: {
			    'Content-Type': 'application/json',
			}
		}).then((res) => res.json()) 
	    .then((res) => {
	    	if (res.result != -1){
          this.setState({
            new:res,
          })
        }else{
          Alert.alert("Veri boş", "?");
        }
	    })
	    .catch((error) => {
			  Alert.alert("data", "Sunucuya bağlanırken bir hata oluştu" + error);
	    });
  }

  /* https://facebook.github.io/react-native/docs/network */
  vote(diff) {
		fetch(this.baseURL+'/vote', {
			method: 'POST',
			headers: {
			    'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        /* https://aboutreact.com/react-native-get-unique-id-of-device/ */
        userid:"mobilkullanici",
        slug:this.state.new.slug,
        diff
      }),
		}).then((res) => res.json()) 
	    .then((res) => {
	    	if (res.result != -1){
          this.setState({
            new:{
              ...this.state.new,
              stats:res
            }
          });
        }else{
          Alert.alert("Veri boş", "?");
        }
	    })
	    .catch((error) => {
			  Alert.alert("data", "Sunucuya bağlanırken bir hata oluştu" + error);
	    });
  }

  //TODO PUSH NOTIFICATION

  componentDidMount(){ 
    this.props.navigation.addListener('willFocus',(payload) => {
      let { slug } = payload.state.params;
      this.getNew(slug)
    });
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
    headerStyle:{
        backgroundColor:'white',
    },
  });
  
  render() {
    return (
      <View>
        <ScrollView>
        <Image
            resizeMode="cover"
            style={{
              width: "100%",
              height: 200,
              backgroundColor: "#eff0f1",
            }}
            source={{uri: this.baseURL+this.state.new.image}}
          />
          <Text
            style={{
              padding:25
            }}
          >
            {this.state.new.content}
          </Text>
          <Text
              style={{
                padding:25,
                paddingTop:0,
                alignSelf:'flex-start',
                lineHeight:20,
              }}
            >
              Görüntülenme: {this.state.new.stats.views}
            </Text>
          <View style={{
            flexDirection: 'row',
            padding:25,
            paddingTop:0,
          }} >
            <Button
              style={{
                alignSelf:"flex-start",
              }}
              title={"Beğen (" + this.state.new.stats.like + ")"}
              onPress={() => this.vote(1)}
            />
            <Text> </Text>
            <Button
              style={{
                alignSelf:"flex-start",
              }}
              title={"Beğenme (" + this.state.new.stats.dislike + ")"}
              onPress={() => this.vote(-1)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}