import { View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import Dots from './Dots';

const Pagination = ({
  numPages,
  currentPage,
  isLight,
  controlStatusBar,
  showSkip,
  showNext,
  showDone,
  onNext,
  onSkip,
  onDone,
  skipLabel,
  nextLabel,
  allowFontScaling,
  SkipButtonComponent,
  NextButtonComponent,
  DoneButtonComponent,
  DotComponent,
}) => {
  const isLastPage = currentPage + 1 === numPages;

  const SkipButtonFinal = showSkip && (
    <SkipButtonComponent
      isLight={isLight}
      isLastPage={isLastPage}
      skipLabel={skipLabel}
      allowFontScaling={allowFontScaling}
      onPress={() => {
        if (typeof onSkip === 'function') {
          if (controlStatusBar) {
            StatusBar.setBarStyle('default', true);
          }
          onSkip();
        }
      }}
    />
  );

  const NextButtonFinal = showNext && !isLastPage && (
    <NextButtonComponent
      nextLabel={nextLabel}
      allowFontScaling={allowFontScaling}
      isLight={isLight}
      onPress={onNext}
    />
  );

  const DoneButtonFinal = showDone && isLastPage && (
    <DoneButtonComponent
      isLight={isLight}
      allowFontScaling={allowFontScaling}
      onPress={() => {
        if (typeof onDone === 'function') {
          if (controlStatusBar) {
            StatusBar.setBarStyle('default', true);
          }
          onDone();
        }
      }}
    />
  );

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        ...styles.container,
      }}
    >
      <Dots
        isLight={isLight}
        numPages={numPages}
        currentPage={currentPage}
        Dot={DotComponent}
        style={styles.dots}
      />
      {NextButtonFinal}
      {DoneButtonFinal}
      {SkipButtonFinal}
    </View>
  );
};

Pagination.propTypes = {
  numPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  isLight: PropTypes.bool.isRequired,
  showNext: PropTypes.bool.isRequired,
  showSkip: PropTypes.bool.isRequired,
  showDone: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  onSkip: PropTypes.func,
  onDone: PropTypes.func,
  allowFontScaling: PropTypes.bool,
  skipLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  nextLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  SkipButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  DoneButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  NextButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  DotComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dots: {
    flexShrink: 0,
  },
};

export default Pagination;
