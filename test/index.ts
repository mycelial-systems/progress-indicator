import { test } from '@substrate-system/tapzero'
import { ProgressIndicator } from '../src/index.js'

ProgressIndicator.define()

test('setup', () => {
    document.body.innerHTML += `
        <progress-indicator progress="0" stroke="8">
            <div role="alert" aria-live="polite">
                <p>Loading, please wait…</p>
            </div>
        </progress-indicator>
    `
})

let el:ProgressIndicator
test('Find the element', async t => {
    el = document.querySelector('progress-indicator') as ProgressIndicator
    t.ok(el, 'should find the element')
})

test('set the attribute', t => {
    el.setProgress(50)
    const progressCount = el.querySelector('[data-progress-count]') as
        HTMLElement
    t.ok(progressCount.innerText.includes('50'),
        'should set the attribute to 50')
})

test('framework-style: createElement then setAttribute uses ' +
    'current attributes, not defaults', t => {
    // Mimic what frameworks (Preact, React, Lit, Vue) do: createElement,
    // then set attributes. The constructor runs before viewbox/stroke
    // are set, so any value cached at construction is stale.
    const el = document.createElement('progress-indicator') as ProgressIndicator
    el.setAttribute('progress', '0')
    el.setAttribute('viewbox', '80')
    el.setAttribute('stroke', '6')
    document.body.appendChild(el)

    const circle = el.querySelector('[data-progress-circle]') as HTMLElement
    t.ok(circle, 'should have rendered the progress circle')

    const r = Number(circle.getAttribute('r'))
    const expectedCircumference = 2 * Math.PI * r
    const dashoffset = parseFloat(circle.style.strokeDashoffset)

    t.ok(
        Math.abs(dashoffset - expectedCircumference) < 0.01,
        'strokeDashoffset for progress=0 must equal the SVG circle ' +
        'circumference (got dashoffset=' + dashoffset +
        ', expected=' + expectedCircumference + ')'
    )
})

test('all done', () => {
    // @ts-expect-error tests
    window.testsFinished = true
})
