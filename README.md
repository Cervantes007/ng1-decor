## Enjoy again programming with `angularjs`
Library created to those people who remains using angularjs 1.x for any reason, to use new features of JS and CSS and
can apply CDD (Component Driven Development - components composition) without pain using angularjs 1.x

## Features

- Lightweight 1.5kb (min/gzip) - 4.5kb (min)
- No Dependencies
- Allow easy build one file component.
- Built-in decorators `@component`, `@directive`, `@pipe`, `@injectable`, `@input`, `@output`, `@reaction`
- `html` tagged string function allow you write less and IDE highlight.
- Encourage use of css-in-js in angularjs developers.
- All elements has isolate scope built-in and are well tested.

Give it a try, Thanks.

## Installation

`npm install ng1-decor --save`

`yarn add ng1-decor`

## Usage

```typescript
import { component, html } from 'ng1-decor';

@component({
  selector: 'my-component',
  render: html`
    <div>
      <input type="text" ng-model="vm.name" />
      <h1>Hello {{vm.name}}</h1>
      <fun-component name="vm.name" />
    </div>
  `,
})
export class MyComponent {
  name = 'World';
}
```

`ng1-decor.html` function enable self-closing tags `<fun-component name="vm.name" />`

Simple, isn't it? but it can be more simple and fun.

```typescript
import { component, html, input } from 'ng1-decor';

@component({
  render: html`
    <h1>@.name</h1>
  `,
})
export class FunComponent {
  @input('@') name;
}
```

- `ng1-decor.html` function enable shortcut for template interpolation, now `{{vm.name}}` can be write like `@.name`

We encourage you to use css-in-js for styles, try `emotion` is a great library.
Change style base on `@input`.
If name input has a valid string then it will be show in `green` else in `red`.

```typescript
import { component, html, input } from 'ng1-decor';
import { css } from 'emotion';

@component({
  render: html`
    <h1 class="#">Name: @.name</h1>
  `,
})
export class FunComponent {
  @input('@') name;
  css = () => css`
    color: ${this.name ? 'green' : 'red'};
  `;
}
```

- `ng1-decor.html` function enable shortcut for styles, now `class="{{vm.css}}"` can be write like `class="#"`
Notice: It only will works inside a class attribute.

....