const onResizeCallbacks = [];

window.addEventListener('resize', event => {
  onResizeCallbacks.forEach( f => f(event) );
});

export const onResize = f => onResizeCallbacks.push(f);
