const stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom

export const addStats = container => container.appendChild( stats.dom );
export const statsBegin = stats.begin;
export const statsEnd = stats.end;
