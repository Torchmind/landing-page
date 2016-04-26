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
import {Scene} from "../scene/Scene";

/**
 * Scene Transition
 *
 * Provides a method of interpolating two scenes over the course of a certain amount of time.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export interface SceneTransition {

        /**
         * Draws a scene transition.
         *
         * Note: Transitions are in charge of drawing scenes independently during their runtime, the core application
         * will not attempt to draw the scenes.
         *
         * @param container a container to draw in.
         * @param delta a number which describes the relation between updates and realworld seconds.
         * @param a the first (current scene).
         * @param b the scene to transition to.
         * @return [boolean} if true, indicates that the animation has been finalized, if false indicates that more steps are needed.
         */
        draw(container : Container, delta: number, a : Scene, b : Scene) : boolean;
}
