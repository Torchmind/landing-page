/*
 * Copyright 2016 Johannes Donath <johannesd@torchmind.com>
 * and other copyright owners as documented in the project's IP log.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Container} from "../../firefly/container/Container";
import {Point, Vector2} from "../../firefly/space/Position";
import {VelocityEntity} from "../../firefly/entity/VelocityEntity";
import {Color} from "../../firefly/utility/Color";

/**
 * Triangle Entity
 *
 * Represents a triangle within the default scene.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class TriangleEntity extends VelocityEntity {
        private _lifetime : number = 0;
        private _scale : number;
        private _dead : boolean;

        public constructor() {
                super();

                this._scale = Math.max(0.25, Math.random()) * 2;
                this.rotation = Math.random() * 360;
                this.velocity = Vector2.RANDOM.multiplyByFactor(8).offsetBy(new Vector2(-4, -4));
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                super.draw(container, delta);

                container.strokeColor.alpha = (Math.min(1.0, (this._lifetime / 5.0))) * 160;

                container.startPath();
                container.addPoint(new Point(0, 0));
                container.addPoint(new Point((this._scale * -100), (this._scale * -80)));
                container.addPoint(new Point((this._scale * 100), (this._scale * -80)));
                container.addPoint(new Point(0, 0));
                container.strokePath();
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                this._lifetime += delta;

                super.think(container, delta);

                const min = -(this._scale * 100);
                const maxX = (container.bounds.width - min);
                const maxY = (container.bounds.height - min);

                this._dead = (this.position.x <= min || this.position.x >= maxX || this.position.y <= min || this.position.y >= maxY);
        }

        /**
         * {@inheritDoc}
         */
        public isDead() : boolean {
                return this._dead;
        }
}
