import { define as Define } from '@substrate-system/web-component'
export const TAG = 'progress-indicator'

/**
 * Light version.
 * Do not render, only attach event listeners.
 */
export class ProgressIndicator extends HTMLElement {
    static TAG = TAG

    static define () {
        Define(ProgressIndicator.TAG, this)
    }

    static get observedAttributes () {
        return ['progress']
    }

    get viewBox ():number {
        return (this.getAttribute('viewbox') ?
            parseInt(this.getAttribute('viewbox')!) :
            100)
    }

    get stroke ():number {
        return (this.getAttribute('stroke') ?
            parseInt(this.getAttribute('stroke')!) :
            5)
    }

    get radius ():number {
        return this.viewBox / 2
    }

    get calculatedCircumference ():number {
        return (this.radius - this.stroke) * 2 * Math.PI
    }

    get label ():string {
        return (
            this.getAttribute('label') ||
            this.getAttribute('aria-label') ||
            'Current progress'
        )
    }

    attributeChangedCallback (name:string, _oldValue, newValue:number):void {
        if (name === 'progress') {
            this.setProgress(newValue)
        }
    }

    connectedCallback () {
        // Set the custom property viewbox value for our CSS to latch on to
        this.style.setProperty('--progress-indicator-viewbox', `${this.viewBox}px`)

        // Set the default aria role states
        this.setAttribute('aria-label', this.label)
        this.setAttribute('role', 'progressbar')
        this.setAttribute('aria-valuemin', '0')
        this.setAttribute('aria-valuemax', '100')
        this.removeAttribute('label')

        // so there is no flash of incorrect progress
        const circle = this.querySelector('[data-progress-circle]') as HTMLElement
        const value = '' + (this.calculatedCircumference -
            (0 / 100) * this.calculatedCircumference)
        circle.style.strokeDashoffset = value
    }

    setProgress (_percent:number|string) {
        let percent:number
        if (typeof _percent === 'string') {
            percent = parseInt(_percent)
        } else {
            percent = _percent
        }
        // Always make sure the percentage passed never exceeds the max
        if (percent > 100) {
            percent = 100
        }

        // Set the aria role value for screen readers
        this.setAttribute('aria-valuenow', '' + percent)

        const circle = this.querySelector('[data-progress-circle]') as
            HTMLElement
        const progressCount = this.querySelector('[data-progress-count]') as
            HTMLElement
        const announcement = this.querySelector('[data-progress-announcement]') as
            HTMLElement

        if (!circle) {  // if we have not rendered yet
            return setTimeout(() => {
                this.setProgress(percent)
            }, 0)
        }

        // Calculate a dash offset value based on the calculated circumference
        // and the current percentage
        circle.style.strokeDashoffset = ('' +
            (this.calculatedCircumference -
            (percent / 100) * this.calculatedCircumference))

        // A human readable version for the text label
        progressCount.innerText = `${percent}%`

        // Update screen reader announcement
        if (announcement) {
            announcement.innerText = percent === 100 ? 'Complete' : `${percent} percent`
        }

        // Set a complete or pending state based on progress
        if (percent === 100) {
            this.setAttribute('data-progress-state', 'complete')
        } else {
            this.setAttribute('data-progress-state', 'pending')
        }
    }
}

export function define () {
    return Define(TAG, ProgressIndicator)
}
