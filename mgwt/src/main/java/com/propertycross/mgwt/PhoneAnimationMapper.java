package com.propertycross.mgwt;

import com.google.gwt.place.shared.Place;
import com.googlecode.mgwt.mvp.client.Animation;
import com.googlecode.mgwt.mvp.client.AnimationMapper;
import com.propertycross.mgwt.place.PropertyCrossPlace;
import com.propertycross.mgwt.place.SearchResultsPlace;

public class PhoneAnimationMapper implements AnimationMapper {

  @Override
  public Animation getAnimation(Place oldPlace, Place newPlace) {

    if (oldPlace instanceof PropertyCrossPlace && newPlace instanceof SearchResultsPlace) {
      return Animation.SLIDE;
    } else if (oldPlace instanceof SearchResultsPlace && newPlace instanceof PropertyCrossPlace) {
      return Animation.SLIDE_REVERSE;
    } 

    // no animation by default e.g. loading, using menu
    return null;
  }

}
