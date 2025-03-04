import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  SafeAreaView,
  ViewPropTypes,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import tinycolor from 'tinycolor2';

import Page from './Page';
import Pagination from './Pagination';
import Dot from './Dot';
import SkipButton from './buttons/SkipButton';
import NextButton from './buttons/NextButton';
import DoneButton from './buttons/DoneButton';

// hotfix: https://github.com/facebook/react-native/issues/16710
const itemVisibleHotfix = { itemVisiblePercentThreshold: 100 };

class Onboarding extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 0,
      previousPage: null,
      width: null,
      backgroundColorAnim: new Animated.Value(0),
    };
  }

  componentDidUpdate() {
    Animated.timing(this.state.backgroundColorAnim, {
      toValue: 1,
      duration: this.props.transitionAnimationDuration,
      useNativeDriver: false,
    }).start();
  }

  onSwipePageChange = ({ viewableItems }) => {
    if (!viewableItems[0] || this.state.currentPage === viewableItems[0].index)
      return;

    this.setState((state) => {
      this.props.pageIndexCallback &&
        this.props.pageIndexCallback(viewableItems[0].index);
      return {
        previousPage: state.currentPage,
        currentPage: viewableItems[0].index,
        backgroundColorAnim: new Animated.Value(0),
      };
    });
  };

  goNext = () => {
    this.flatList.scrollToIndex({
      animated: true,
      index: this.state.currentPage + 1,
    });
  };

  _onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    const { image, title, subtitle, backgroundColor } = item;
    const isLight = tinycolor(backgroundColor).getBrightness() > 180;
    const {
      containerStyles,
      imageContainerStyles,
      allowFontScalingText,
      titleStyles,
      subTitleStyles,
    } = this.props;

    return (
      <Page
        isLight={isLight}
        image={image}
        title={title}
        subtitle={subtitle}
        width={this.state.width || Dimensions.get('window').width}
        containerStyles={containerStyles}
        imageContainerStyles={imageContainerStyles}
        allowFontScaling={allowFontScalingText}
        titleStyles={Object.assign(
          {},
          titleStyles || {},
          item.titleStyles || {}
        )}
        subTitleStyles={Object.assign(
          {},
          subTitleStyles || {},
          item.subTitleStyles || {}
        )}
      />
    );
  };

  render() {
    const {
      pages,
      controlStatusBar,
      showSkip,
      showNext,
      showDone,
      showPagination,
      onSkip,
      onDone,
      skipLabel,
      nextLabel,
      allowFontScalingButtons,
      SkipButtonComponent,
      DoneButtonComponent,
      NextButtonComponent,
      DotComponent,
      flatlistProps,
      skipToPage,
    } = this.props;
    const currentPage = pages[this.state.currentPage] || pages[0];
    const currentBackgroundColor = currentPage?.backgroundColor || '#000';
    const isLight = tinycolor(currentBackgroundColor).getBrightness() > 180;
    const barStyle = isLight ? 'dark-content' : 'light-content';

    let backgroundColor = currentBackgroundColor;
    if (
      this.state.previousPage !== null &&
      pages[this.state.previousPage] !== undefined
    ) {
      const previousBackgroundColor =
        pages[this.state.previousPage].backgroundColor;
      backgroundColor = this.state.backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [previousBackgroundColor, currentBackgroundColor],
      });
    }

    const skipFun =
      skipToPage != null
        ? () => {
            this.flatList.scrollToIndex({
              animated: true,
              index: skipToPage,
            });
          }
        : onSkip;

    return (
      <Animated.View
        onLayout={this._onLayout}
        style={{ flex: 1, backgroundColor, justifyContent: 'center' }}
      >
        {controlStatusBar && <StatusBar barStyle={barStyle} />}
        <FlatList
          ref={(list) => {
            this.flatList = list;
          }}
          data={pages}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onViewableItemsChanged={this.onSwipePageChange}
          viewabilityConfig={itemVisibleHotfix}
          initialNumToRender={1}
          extraData={
            this.state.width // ensure that the list re-renders on orientation change
          }
          {...flatlistProps}
        />
        {showPagination && (
          <SafeAreaView>
            <Pagination
              isLight={isLight}
              showSkip={showSkip}
              showNext={showNext}
              showDone={showDone}
              numPages={pages.length}
              currentPage={this.state.currentPage}
              controlStatusBar={controlStatusBar}
              onSkip={skipFun}
              onDone={onDone}
              onNext={this.goNext}
              skipLabel={skipLabel}
              nextLabel={nextLabel}
              allowFontScaling={allowFontScalingButtons}
              SkipButtonComponent={SkipButtonComponent}
              DoneButtonComponent={DoneButtonComponent}
              NextButtonComponent={NextButtonComponent}
              DotComponent={DotComponent}
            />
          </SafeAreaView>
        )}
      </Animated.View>
    );
  }
}

Onboarding.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      backgroundColor: PropTypes.string.isRequired,
      image: PropTypes.element.isRequired,
      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.func,
      ]).isRequired,
      subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    })
  ).isRequired,
  controlStatusBar: PropTypes.bool,
  showSkip: PropTypes.bool,
  showNext: PropTypes.bool,
  showDone: PropTypes.bool,
  showPagination: PropTypes.bool,
  onSkip: PropTypes.func,
  onDone: PropTypes.func,
  skipLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  nextLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  SkipButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  DoneButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  NextButtonComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  DotComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  containerStyles: ViewPropTypes.style,
  imageContainerStyles: ViewPropTypes.style,
  allowFontScalingText: PropTypes.bool,
  allowFontScalingButtons: PropTypes.bool,
  titleStyles: Text.propTypes.style,
  subTitleStyles: Text.propTypes.style,
  transitionAnimationDuration: PropTypes.number,
  skipToPage: PropTypes.number,
  pageIndexCallback: PropTypes.func,
};

Onboarding.defaultProps = {
  controlStatusBar: true,
  showPagination: true,
  showSkip: true,
  showNext: true,
  showDone: true,
  skipLabel: 'Skip',
  nextLabel: 'Next',
  onSkip: null,
  onDone: null,
  SkipButtonComponent: SkipButton,
  DoneButtonComponent: DoneButton,
  NextButtonComponent: NextButton,
  DotComponent: Dot,
  containerStyles: null,
  imageContainerStyles: null,
  allowFontScalingText: true,
  allowFontScalingButtons: true,
  titleStyles: null,
  subTitleStyles: null,
  transitionAnimationDuration: 500,
  skipToPage: null,
  pageIndexCallback: null,
};

export default Onboarding;
