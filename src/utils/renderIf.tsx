const renderIf = (Comp: JSX.Element, condition: boolean) => {
  return condition ? Comp : null;
};

export default renderIf;
