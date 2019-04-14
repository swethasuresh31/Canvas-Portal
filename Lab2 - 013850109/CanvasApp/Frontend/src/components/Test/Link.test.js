// Link.react.test.js
import React from 'react';
import Card from '../Dashboard/Card';
import MessageNav from '../Message/MessageNav';
import CourseNav from '../Courses/CourseModules/CourseNav';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, render } from 'enzyme';

configure({ adapter: new Adapter() });


it('Dashboard should exist 1', () => {
  const item = {}
  const component = mount( <Card item={item}/>);
  expect(component.exists()).toBe(true);
});

it('message navigation should render correctly 1', () => {
  const component = mount( <MessageNav />);
  expect(component.exists()).toBe(true);
});

it('CourseNav should render correctly 1', () => {
  const component = mount( <CourseNav />);
  expect(component.exists()).toBe(true);
});

