/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';

const TagName = "UU5.Bricks.Footer";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {

  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: false
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = renderer.create(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Paragraph id={"uuID02"}/>
        <UU5.Bricks.Footer id={"uuID03"} className='center'>
          <UU5.Bricks.Span id={"uuID04"} content='Copyright © 2016 Unicorn Universe. All Rights Reserved '/>
          <UU5.Bricks.Icon id={"uuID05"} icon='mdi-home'/>
      </UU5.Bricks.Footer>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










