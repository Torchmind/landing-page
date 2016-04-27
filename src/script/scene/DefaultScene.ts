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
import {Container} from "../firefly/container/Container";
import {EntityScene} from "../firefly/scene/EntityScene";
import {TriangleEntity} from "./drawable/TriangleEntity";
import {Vector2} from "../firefly/space/Position";

/**
 * Default Scene
 *
 * Provides a simple scene which draws a set of triangles on screen.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class DefaultScene extends EntityScene {

        public constructor() {
                super();
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                container.strokeColor.red = container.fillColor.red = container.strokeColor.green = container.fillColor.green = container.strokeColor.blue = container.fillColor.blue = 255;

                super.draw(container, delta);
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                super.think(container, delta);
                const bounds : Vector2 = container.bounds.end;

                while(this.length < (container.bounds.pixels * 0.00004)) {
                        const entity : TriangleEntity = new TriangleEntity();
                        entity.position = Vector2.RANDOM.multiplyBy(bounds);
                        this.spawn(entity);
                }
        }
}
