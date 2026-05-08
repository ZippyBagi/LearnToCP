/** Width every custom roadmap node is rendered at (px). */
export const NODE_WIDTH = 280;

/** Side-length of the small connector dot (px) — matches size-3 = 12px. */
export const CONNECTOR_SIZE = 12;

/**
 * X position for a connector node so its centre aligns with the centre of
 * the surrounding layer (whose leftmost node sits at x = 0 in local coords).
 *   centre of layout  = NODE_WIDTH / 2
 *   left edge of dot  = centre − CONNECTOR_SIZE / 2
 */
export const CONNECTOR_X = NODE_WIDTH / 2 - CONNECTOR_SIZE / 2;
