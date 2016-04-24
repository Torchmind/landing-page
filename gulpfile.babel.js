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
'use strict';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import htmlMinify from 'gulp-htmlmin';
import less from 'gulp-less';
import path from 'path';
import plumber from 'gulp-plumber';
import sequence from 'gulp-sequence';
import sourcemaps from 'gulp-sourcemaps';
import swig from 'gulp-swig';
import tsc from 'gulp-typescript';
import uglify from 'gulp-uglify';

// === Globals === \\
const sync = browserSync.create();
const project = tsc.createProject(path.join(__dirname, 'tsconfig.json'));

// === Group Tasks === \\

/**
 * Default Task
 *
 * An alias which automatically generates, transpiles and optimizes all resources to get them ready for distribution.
 */
gulp.task('default', sequence('clean', 'build'));

/**
 * Development Task
 *
 * An alias which automatically enters development mode.
 */
gulp.task('development', sequence('clean', 'serve'));

/**
 * Build Task
 *
 * Generates, transpiles and optimizes all resources to get them ready for distribution.
 */
gulp.task('build', ['script', 'static']);
gulp.task('build-development', ['script-development', 'static'])

/**
 * Script Task
 *
 * Copies all dependencies and compiles the typescript sources into regular old JavaScript.
 */
gulp.task('script', ['dependency', 'typescript'])
gulp.task('script-development', ['dependency', 'typescript-development']);

/**
 * Static Task
 *
 * Copies and optimizes all static resources into the distribution directory.
 */
gulp.task('static', ['less', 'resource', 'template']);


// === Utility Tasks === \\

/**
 * Clean Task
 *
 * Deletes all resources from within the distribution directory to prepare for a clean build.
 */
gulp.task('clean', (cb) => {
        return del(path.join(__dirname, 'dist/'), cb);
});

/**
 * Serve Task
 *
 * Starts a Browser Sync server which assists with development by automatically introducing updated resources to
 * browsers which are currently viewing the website.
 */
gulp.task('serve', ['build-development'], () => {
        // initialize Browser Sync server first
        sync.init({
                server: path.join(__dirname, 'dist/')
        });

        // create watchers to automatically run our tasks when needed
        gulp.watch(path.join(__dirname, 'src/script/**/*.ts'), ['typescript-development']);
        gulp.watch(path.join(__dirname, 'src/less/**/*.less'), ['less']);
        gulp.watch(path.join(__dirname, 'src/image/**/*'), ['image']);
        gulp.watch(path.join(__dirname, 'src/template/*.html'), ['template']);
});

// === Script Tasks === \\

/**
 * Dependency Task
 *
 * Copies all frontend dependencies to the distribution directory.
 */
gulp.task('dependency', () => {
        return gulp.src([
                        path.join(__dirname, 'node_modules/es6-shim/es6-shim.min.js'),
                        path.join(__dirname, 'node_modules/es6-shim/es6-shim.map'),
                        path.join(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
                        path.join(__dirname, 'node_modules/jquery/dist/jquery.min.map'),
                        path.join(__dirname, 'node_modules/normalize.css/normalize.css'),
                        path.join(__dirname, 'node_modules/systemjs/dist/system.js'),
                        path.join(__dirname, 'node_modules/systemjs/dist/system.js.map'),
                        path.join(__dirname, 'node_modules/systemjs/dist/system-polyfills.js'),
                        path.join(__dirname, 'node_modules/systemjs/dist/system-polyfills.js.map')
                ])
                .pipe(gulp.dest(path.join(__dirname, 'dist/assets/3rdParty/')));
});

/**
 * Typescript Task
 *
 * Transpiles, optimizes and copies all TypeScript resources to the distribution directory.
 */
gulp.task('typescript', () => {
        return gulp.src(path.join(__dirname, 'src/script/**/*.ts'))
                .pipe(sourcemaps.init())
                .pipe(tsc(project))
                .pipe(uglify())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/assets/script/')))
                .pipe(sync.stream());
});

gulp.task('typescript-development', () => {
        return gulp.src(path.join(__dirname, 'src/script/**/*.ts'))
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(tsc(project))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/assets/script/')))
                .pipe(sync.stream());
});

// === Static Resource Tasks === \\

/**
 * Less Task
 *
 * Transpiles all less stylesheets into browser compatible CSS stylesheets.
 */
gulp.task('less', () => {
        return gulp.src(path.join(__dirname, 'src/less/*.less'))
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(autoprefixer())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/assets/style/')))
                .pipe(sync.stream());
});

/**
 * Resource Task
 *
 * Copies all entirely static resources to the distribution directory.
 */
gulp.task('resource', () => {
        return gulp.src(path.join(__dirname, 'src/image/**/*'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/assets/image/')))
                .pipe(sync.stream());
});

/**
 * Template Task
 *
 * Compiles, optimizes and copies all templates to the distribution directory.
 */
gulp.task('template', () => {
        return gulp.src([
                        path.join(__dirname, 'src/template/*.html'),
                        '!' + path.join(__dirname, 'src/template/layout.html')
                ])
                .pipe(swig({
                        defaults: {
                                cache: false
                        }
                }))
                .pipe(htmlMinify({
                        caseSensitive:      true,
                        collapseWhitespace: true,
                        minifyCSS:          true,
                        minifyJS:           true,
                        removeComments:     true
                }))
                .pipe(gulp.dest(path.join(__dirname, 'dist/')))
                .pipe(sync.stream());
});
