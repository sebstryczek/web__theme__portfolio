const doOnceAfterRenderCallbacks = [];
export const doOnceAfterRender = f => {
  let done = false;
  doOnceAfterRenderCallbacks.push( () => {
    if (done) return;
    f();
    done = true;
  } );
}

export const doOnceAfterRenderInvoke = () => doOnceAfterRenderCallbacks.forEach( f => f() );
