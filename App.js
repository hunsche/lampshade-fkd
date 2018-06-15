import React from 'react';
import {
  TouchableHighlight,
  Linking,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button
} from 'react-native';
import { SlidersColorPicker } from 'react-native-color';
import tinycolor from 'tinycolor2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';

const axios = Axios.create({ baseURL: 'http://192.168.4.1' });
const defaultColor = '#ffff00';
const offColor = '#000000';

export default class App extends React.Component {
  state = {
    modalColorVisible: false,
    modalAboutVisible: false,
    main: ['#0000ff', '#ff00ff', '#e6e6e6', '#ffff00', '#00ffff', '#00ff00', '#ff0000'],
    color: tinycolor(offColor).toHsl(),
    isOn: false
  };

  setToggleOnOff = () => {
    this.setState({ color: tinycolor(this.state.isOn ? offColor : defaultColor).toHsl() });
    this.setState({ isOn: !this.state.isOn });
    axios.get(`/toggleOnOff`);
  }

  getTitleIsOn = () => this.state.isOn ? 'Desligar' : 'Ligar'

  render() {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Lampshade FKD
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Icon
            style={styles.icon}
            name="lamp"
            size={100}
            color={tinycolor(this.state.color).toHslString()}
          />

          <View style={styles.space}>
            <Button
              color='#FFC400'
              title={this.getTitleIsOn()}
              onPress={() => this.setToggleOnOff()}
            />
          </View>

          <View style={styles.space}>
            <Button
              color='#FFC400'
              title='Cor'
              onPress={() => this.setState({ modalColorVisible: true })}
            />
          </View>

          <View style={styles.space}>
            <Button
              color='#FFC400'
              title='Sobre'
              onPress={() => this.setState({ modalAboutVisible: true })}
            />
          </View>

          <View style={styles.footer} />

          <SlidersColorPicker
            visible={this.state.modalColorVisible}
            color={this.state.color}
            returnMode={'hex'}
            onCancel={() => this.setState({ modalColorVisible: false })}
            onOk={colorHex => {
              this.setState({ isOn: true });
              this.setState({ modalColorVisible: false, color: tinycolor(colorHex).toHsl() });
              let rgb = tinycolor(colorHex).toRgb();
              axios.get(`/setRgb?r=${rgb.r}&g=${rgb.g}&b=${rgb.b}`);
            }}
            swatches={this.state.main}
            swatchesLabel="PRINCIPAIS"
            okLabel="Confirmar"
            cancelLabel="Cancelar"
          />

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalAboutVisible}
            onRequestClose={() => this.setState({ modalAboutVisible: false })}>
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.space}>
                <Image style={styles.image} source={require('./img/logo.jpeg')} />
              </View>

              <View style={styles.spaceAbout}>
                <Text> Fernanda </Text>
                <Image style={styles.image} source={require('./img/fernanda.jpeg')} />
              </View>

              <View style={styles.spaceAbout}>
                <Text> Karine </Text>
                <Image style={styles.image} source={require('./img/karine.jpeg')} />
              </View>

              <View style={styles.spaceAbout}>
                <Text> Djeniffer </Text>
                <Image style={styles.image} source={require('./img/djeniffer.jpeg')} />
              </View>

              <View style={styles.spaceAbout}>
                <Text> Microcontrolador sexy (ESP8266-nodemcu) </Text>
                <Image style={styles.image} source={require('./img/microcontroller.jpeg')} />
              </View>

              <View style={styles.spaceAbout}>
                <Text> Circuito </Text>
                <Image style={styles.image} source={require('./img/circuit.jpeg')} />
              </View>

              <View style={styles.spaceAbout}>
                <Text> Código fonte </Text>
                <TouchableHighlight onPress={() => console.log('teste') || Linking.openURL('https://github.com/hunsche/lampshade-fkd')}>
                  <Image
                    style={styles.image}
                    source={require('./img/github.png')}
                  />
                </TouchableHighlight>
              </View>

              <View style={styles.space}>
                <Button
                  color='#FFC400'
                  title='Fechar'
                  onPress={() => this.setState({ modalAboutVisible: false })}
                />
              </View>
            </ScrollView>
          </Modal>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    backgroundColor: '#FFC400'
  },
  headerText: {
    color: '#ffffff',
    marginTop: 40,
    fontSize: 34,
    lineHeight: 41,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 32
  },
  space: {
    paddingTop: 10
  },
  spaceAbout: {
    paddingBottom: 50
  },
  icon: {
    alignSelf: 'center',
    paddingBottom: 32,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    resizeMode: Image.resizeMode.contain
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 32,
    width: 100,
    height: 100
  }
});