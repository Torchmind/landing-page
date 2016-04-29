/// <reference path="../../typings/browser.d.ts" />
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
import {AsteroidsScene} from "./scene/AsteroidsScene";
import {CanvasContainer} from "./firefly/container/CanvasContainer";
import {DefaultScene} from "./scene/DefaultScene";
import {Firefly} from "./firefly/Firefly";
import {Dimensions} from "./firefly/space/Dimensions";
import {FadeTransition} from "./firefly/scene/FadeTransition";
declare const $:any;

// Firefly Initialization
const firefly : Firefly = new Firefly(new CanvasContainer(<HTMLCanvasElement> document.getElementById('background')));
firefly.switchScene(new DefaultScene());
firefly.tickRate = 80; // higher tick rate as our minigame movement is just too fast

function resize() {
        firefly.container.bounds = new Dimensions($(window).innerWidth(), $(window).innerHeight());
}

resize();
$(window).resize(resize);
firefly.start();

// Easteregg Trigger
var secretIndex = 0;
const SECRET_CODE = [
        38, // up
        38, // up
        40, // down
        40, // down
        37, // left
        39, // right
        37, // left
        39, // right
        66, // b
        65, // a
        13 // return
];

$(document).keydown((event) => {
        if (firefly.scene instanceof AsteroidsScene) {
                return;
        }

        if (event.keyCode == SECRET_CODE[secretIndex]) {
                if (++secretIndex >= SECRET_CODE.length) {
                        console.log('Well, you found me. Congratulations.');

                        $('#main').hide(5000);

                        secretIndex = 0;
                        firefly.switchScene(new AsteroidsScene(firefly), new FadeTransition(5));
                }
        } else {
                if (secretIndex > 0) {
                        console.log('What was that? I did not quite understand you ...');
                }

                secretIndex = 0;
        }
});
