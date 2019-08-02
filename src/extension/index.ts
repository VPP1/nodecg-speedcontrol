import { NodeCG } from 'nodecg/types/server';
import * as nodecgApiContext from './util/nodecg-api-context';

export = (nodecg: NodeCG): void => {
  // Store a reference to this NodeCG API context for easy access.
  nodecgApiContext.set(nodecg);
};