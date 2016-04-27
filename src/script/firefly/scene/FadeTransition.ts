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
import {Container} from "../container/Container";
import {Scene} from "./Scene";
import {SceneTransition} from "./SceneTransition";

/**
 * Fade Transition
 *
 * Provides a simple transition which slowly fades between two scenes.
 *
 * Note: When specifying color values within an entity or other drawables, it is important that they at least rely on
 * the alpha value of the root scope's color.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class FadeTransition implements SceneTransition {
        private _time : number;
        private _state : number = 0;

        public constructor(time : number) {
                this._time = time;
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number, a : Scene, b : Scene) : boolean {
                this._state += delta;

                // draw scene A (fading out)
                container.isolate(() => {
                        container.fillColor.alpha *= Math.min(1.0, (1.0 - (this._state / this._time)));
                        container.strokeColor.alpha *= Math.min(1.0, (1.0 - (this._state / this._time)));

                        container.drawIsolated(a, delta);
                });

                // draw scene B (fading out)
                container.isolate(() => {
                        container.fillColor.alpha *= Math.min(1.0, (this._state / this._time));
                        container.strokeColor.alpha *= Math.min(1.0, (this._state / this._time));

                        container.drawIsolated(b, delta);
                });

                if (this._state >= this._time) {
                        this._state = 0;
                        return true;
                }

                return false;
        }
}
