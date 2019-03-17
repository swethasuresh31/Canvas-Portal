// Link.react.test.js
import React from 'react';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';
import CourseNav from '../Courses/CourseModules/CourseNav';
import renderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, render } from 'enzyme';

configure({ adapter: new Adapter() });


it('sign up should exist', () => {
  const component = mount( <Signup />);
  expect(component.exists()).toBe(true);
});

it('login should render correctly', () => {
  const component = mount( <Login />);
  expect(component.exists()).toBe(true);
});

it('CourseNav should render correctly', () => {
  const component = mount( <CourseNav />);
  expect(component.exists()).toBe(true);
});

