import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthSession, WebBrowser } from 'expo';

const FB_APP_ID = '358734654571116'; 

export default class App extends React.Component {
  state = {
    result: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="PROFILE Open FB Auth" onPress={this._handlePressAsync} />
        {this.state.result ? (
          <Text>{JSON.stringify(this.state.result)}</Text>
        ) : null}
        </View>
    );
  }

  _handlePressAsync = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
        `&client_id=${FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
				`&scope=${['public_profile', 'publish_actions', 'user_videos', 'user_posts', 'user_photos'].join(',')}`
    });
		
		if (result.type === 'sucess') {
			const token = result.params.access_token;
			const expiresIn = result.params.expires_in;
			alert(token, expiresIn);
		}
   this.setState({ result: result.type + ' ' + result.params.access_token + ' ' + result.params.expires_in });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});