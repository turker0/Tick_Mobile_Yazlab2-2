import React from "react";
import DeviceInfo from "react-native-device-info";

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
    headerTitleStyle: { textAlign: "center", alignSelf: "center" },
    headerStyle: {
      backgroundColor: "white"
    }
  });

  render() {
    return (
      <View>
        <ScrollView>
          <Image
            resizeMode="cover"
            style={styles.postImage}
            source={{ uri: baseURL + this.state.new.image }}
          />
          <Text style={styles.postTitle}>{this.state.new.content}</Text>
          <Text style={styles.view}>
            Görüntülenme: {this.state.new.stats.views}
          </Text>
          <View style={styles.buttons}>
            <Button
              style={styles.button}
              title={"Beğen (" + this.state.new.stats.like + ")"}
              onPress={() => this.vote(1)}
            />
            <Text> </Text>
            <Button
              style={styles.button}
              title={"Beğenme (" + this.state.new.stats.dislike + ")"}
              onPress={() => this.vote(-1)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#eff0f1"
  },
  postTitle: {
    padding: 25
  },
  view: {
    padding: 25,
    paddingTop: 0,
    alignSelf: "flex-start",
    lineHeight: 20
  },
  buttons: {
    flexDirection: "row",
    padding: 25,
    paddingTop: 0
  },
  button: {
    alignSelf: "flex-start"
  }
});
