import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';

const SwipeBackView = ({ onBack, children, style }) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          evt.nativeEvent.pageX < 45 &&
          gestureState.dx > 35 &&
          Math.abs(gestureState.dy) < 30
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 80 && Math.abs(gestureState.vx) > 0.3) {
          if (onBack) onBack();
        }
      },
    })
  ).current;

  return (
    <View style={[{ flex: 1 }, style]} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

export default SwipeBackView;