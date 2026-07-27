export const NODE_WIDTH = 280;
export const CONNECTOR_SIZE = 12;
export const CONNECTOR_X = NODE_WIDTH / 2 - CONNECTOR_SIZE / 2;
export const INITIAL_FIT_LAYERS = 4;

// Phones get a much smaller slice of the graph so the cards stay readable
// instead of being shrunk to fit four layers across a ~360px viewport.
export const INITIAL_FIT_LAYERS_MOBILE = 2;

// React Flow's own defaults — desktop keeps them untouched.
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2;

// Mobile can zoom out further than the default floor, since the whole graph is
// far wider than a phone screen.
export const MIN_ZOOM_MOBILE = 0.15;

// Zoom the initial mobile fit is allowed to settle on — the floor is what keeps
// the roadmap "zoomed in" on a phone; the user pans instead of squinting.
export const FIT_MIN_ZOOM_MOBILE = 0.9;
export const FIT_MAX_ZOOM_MOBILE = 1.05;
