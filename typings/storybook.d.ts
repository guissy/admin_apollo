declare module '@storybook/addon-info' {
  export function withInfo(
    option: string | object
  ): Function;
}

declare module '@storybook/addon-centered' {
  export function call(context: object, storyFn: Function): any; // tslint:disable-line
}
