import React, {Component, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
export default function Loading({show}) {
  return (
    <AnimatedLoader
      visible={show}
      overlayColor="rgba(255,255,255,0.15)"
      source={require('./loader.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
  );
}
const styles = StyleSheet.create({
  lottie: {
    width: 120,
    height: 120,
  },
});
