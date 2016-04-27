
import {EntityScene} from "../firefly/scene/EntityScene";

export class DefaultScene extends EntityScene{

        public constructor() {
                
        }
        
        /**
         * {@inheritDoc}
         */
        public think(delta : number) : void {
                super.think(delta);
        }
}
