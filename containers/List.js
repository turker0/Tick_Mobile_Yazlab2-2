import React, { Component } from 'react';
/* https://documentation.onesignal.com/docs/react-native-sdk-setup */
import OneSignal from 'react-native-onesignal';

import {
	Text,
	View,
  Alert,
  Picker,
  ScrollView,
  Image,
  TouchableNativeFeedback,
  BackHandler,
  ToastAndroid,
  FlatList
} from 'react-native';

export default class App extends Component {

  /* https://stackoverflow.com/questions/46065819/remove-top-navigation-bar-for-certain-screens */
  static navigationOptions = {
    title: 'Tick',
    header: null,
  }

	constructor(props) {
    super(props);
    OneSignal.init("7d5f91ae-d848-475e-b3cc-470d3f2b9fcc");
    OneSignal.addEventListener('received', this.onReceived.bind(this));
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('ids', this.onIds.bind(this));
		this.state = { 
      news: [],
      categories: [],
      currentCategory: "",
		};
  }
  
  baseURL = "https://tick.xava.me";

  /* http://www.avarekodcu.com/konu/17/react-native-ornek-login-uygulamasi-3-ajax-kullanimi-istekler-ve-uyarilar */
  /* https://hackernoon.com/react-native-how-to-setup-your-first-app-a36c450a8a2f */
  /* https://blog.usejournal.com/understanding-react-native-component-lifecycle-api-d78e06870c6d */
  /* https://stackoverflow.com/questions/43380260/draw-horizontal-rule-in-react-native */
  /* https://stackoverflow.com/questions/32030050/how-can-you-float-right-in-react-native */
  /* https://www.youtube.com/watch?v=22LEiBYBiTw */

  getItems() {
		fetch(this.baseURL+'/list/'+this.state.currentCategory, {
			method: 'GET',
			headers: {
			    'Content-Type': 'application/json',
			}
		}).then((res) => res.json()) 
	    .then((res) => {
	    	if (res.result != -1){
          let categories = {};

          // eski kategorileri tut
          this.state.categories.map(cat=>{
            categories[cat] = 1;
          })

          res.map(item=>{
            item.category.map(cat=>{
              categories[cat] = 1;
            })
          });

          res.reverse()

          this.setState({
            news:res,
            categories: Object.keys(categories)
          });
          
          /* https://github.com/facebook/react-native/issues/13560 */
          this.refs.listRef.scrollToOffset({x: 0, y: 0, animated: true})
        }else{
          Alert.alert("Veri boş", "?");
        }
	    })
	    .catch((error) => {
			  Alert.alert("data", "Sunucuya bağlanırken bir hata oluştu" + error);
	    });
  }

  handleBackPress(e) {
    ToastAndroid.show('Güncelleniyor', ToastAndroid.SHORT);
    this.getItems();
    return true; 
  }

  componentWillMount(){
    this.getItems();
  }

  componentDidMount(){
    this.props.navigation.addListener('willFocus',() => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    });
    this.props.navigation.addListener('willBlur',() => {
      this.backHandler.remove();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    OneSignal.removeEventListener('received', this.onReceived.bind(this));
    OneSignal.removeEventListener('opened', this.onOpened.bind(this));
    OneSignal.removeEventListener('ids', this.onIds.bind(this));
  }

  onReceived(notification) {
    // Yeni haber geldi, yenile
    //console.warn("Yeni haber: ", notification);
    this.getItems();
  }

  onOpened(openResult) {
    const {navigate} = this.props.navigation;
    /*
    console.warn('Message: ', openResult.notification.payload.body);
    console.warn('Data: ', openResult.notification.payload.additionalData);
    console.warn('isActive: ', openResult.notification.isAppInFocus);
    console.warn('openResult: ', openResult);
    */
    navigate('Home');
    setTimeout(function(){
      navigate('Post',
        {
          slug: openResult.notification.payload.additionalData.slug,
          title: openResult.notification.payload.additionalData.title
        }
      );
    },300)
  }

  onIds(device) {
    console.warn('Device info: ', device);
  }

  newsList({item}) {
    //console.error(item);
    const {navigate} = this.props.navigation;

    // Tick Admin'den alıntı
    let monthArr = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    var currentDate = new Date(item.date);
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var dateString = date + " " + monthArr[month] + " " + year;

    return (
      <TouchableNativeFeedback
      key={item.slug}
      onPress={()=>{
        navigate('Post', {slug: item.slug, title: item.title})
      }}>
        <View
          style={{
            borderBottomColor: '#edeef1',
            borderBottomWidth: 1,
            width:"100%",
            marginBottom:10,
          }}
        >
          <Image
            style={{
              width: "100%",
              height: 150,
              backgroundColor: "#eff0f1",
            }}
            source={{uri: this.baseURL+item.image}}
          />
          <Text
            style={{
              fontFamily: 'Nunito-SemiBold',
              fontSize: 22,
              padding:25,
              color:"#222",
              paddingBottom:0,
            }}
          >
            {item.title}
          </Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingBottom:30,
              paddingLeft:25,
              paddingRight:25,
            }}
          >
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 14,
                paddingTop:10,
                alignSelf:"flex-start",
              }}
            >
              {item.category.join(", ").toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                fontSize: 14,
                paddingTop:10,
                color:"#aaa",
                alignSelf:"flex-end",
              }}
            >
              {dateString}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

	render() {
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
			    justifyContent: 'flex-start',
          padding: 0,
          fontFamily: 'Nunito-Bold'
				}}>
        <View style={{
            justifyContent: 'space-around',
            flexDirection: 'row',
            padding:10,
            paddingLeft:25,
            paddingRight:25,
          }} >
          <Text style={{
              lineHeight: 50,
              width: "50%",
              alignSelf:"flex-start",
              fontFamily: 'Nunito-Black',
              fontSize: 24,
            }}>
            tick
          </Text>
          <Picker
            selectedValue={this.state.currentCategory}
            style={{
              height: 50,
              width: "50%",
              alignSelf:"flex-end"
            }}
            onValueChange={(itemValue) =>
              this.setState({
                currentCategory:itemValue
              },()=>{
                this.getItems();
              })
            }>
            <Picker.Item label="Tümü" value="" />
            {this.state.categories.map(el=>{
              return <Picker.Item key={el} label={el} value={el} />
            })}
          </Picker>
        </View>
        
        <View
          style={{
            borderBottomColor: '#edeef1',
            borderBottomWidth: 2,
          }}
        />
        <View
          style={{
            padding:0,
            paddingBottom:72,
          }}
        >
          <FlatList
            data={this.state.news}
            extraData={this.state}
            keyExtractor={(item, index) => item.slug}
            renderItem={this.newsList.bind(this)}
            ref="listRef"
          />
        </View>
				
			</View>
		);
	}
}