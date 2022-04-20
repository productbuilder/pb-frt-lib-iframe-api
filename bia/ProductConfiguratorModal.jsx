import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withTranslation} from 'react-i18next'
import {mergeClassNames} from 'bia-template-helpers'
import {
    propsFilter,
    canUseDOM,
    setHtmlOverflow,
    getHtmlOverflow,
    isMobile,
} from '_utils'
import {
    PBWindowClient,
    AddModal,
} from '_components'
import s from './ProductConfiguratorModal.scss'

class ProductConfiguratorModal extends React.PureComponent {

    constructor(props) {
        super(props)
        this.cursorRef = React.createRef()
        this.dialogRef = React.createRef()
        this.productbuilderRef = React.createRef()
        this.pbClient = false
        this.subscription = false
        this.notifications = []
        this.product = props.product
        // buyable
        const metaBuyable  = props.product?.meta_data.find(({key}) => key === `buyable`) || {}
        this.buyable = metaBuyable.value
        this.currentConfig = {}
        this.t = props.t
    }

    state = {
        moodboardOpen: false,
        screenShot: false,
    }


    componentDidMount() {
        // First check if the iFrame content is loaded before starting the MoodelClient 
        // or we'll get Cross-domain errors on the pbClient requests
        console.log(this.product)
        this.checkIframeLoaded()
    }


    render() {
        const {moodboardOpen, screenShot} = this.state
        const {
            t,
            className,
            product,
        } = this.props
        return (
            <>
            <div>
                <button onClick={this.processMoodboardEvent}>Add to moodboard</button>
                <button onClick={this.processBuyEvent}>Buy</button>
                <iframe 
                width={`1199`}
                height={`799`}
                id={`productBuilder`}
                frameBorder={`0`}
                ref={this.productbuilderRef}
                className={className}
                src={`https://acceptance.productbuilder.nl/moooi/_configurator/api-test/?product_id=${product.id}&buyable=${this.buyable}&hideLogo=true`}>
                </iframe>
            </div>
            <AddModal
                    open={moodboardOpen && screenShot.data}
                    onClose={this.onCloseMoodboard}
                    productId={product.id}
                    materialId={0}
                    imageAlt={product.name}
                    base64={screenShot.data}
                    copyHTML={t(
                        `Add this product<br />to a mood board`
                    )}
                />
            </>
        )
    }


    startMoodelClient = () => {
            this.pbClient = new PBWindowClient(this.productbuilderRef.current)
            this.pbClient.addNotificationHandler(
                '*',
                ( event ) => {

                    // History
                    this.notifications.push( event )
                    this.currentConfig = event;
                    switch(event.type) {
                        case 'price': 
                            this.processPriceEvent(event)
                            break
                        case 'buy': 
                            this.processBuyEvent(event)
                            break
                        case 'moodboard': 
                            this.processMoodboardEvent(event)
                            break
                        default:
                            console.warn('undefined event type: ', event.type)
                    }
                }
            )
            this.startSubscription()
        }

    //TODO BY MOODEL This fails on moooi.local but works on localhost due to server restrictions

    startSubscription = () => {
        const subscriptionRequest =  this.pbClient.request('subscribe')
        .then((successMsg) => {
            this.subscription = true;
        })
        .catch((err) => {
            this.subscription = false;
            //try again
            this.startSubscription()
        })
    }

    // Set buy/contact button depending on wether a product is sold out
    requestScreenshot = () => {
        console.warn('requestScreenshot')
        const imageRequest =  this.pbClient.request('screenshot').then((imgData) => {
            console.warn(imgData)
            this.setState({
                screenShot: imgData,
            })
        })
    }

    // Process event types

    processPriceEvent = (moodBoardEvent) => {
        console.log(moodBoardEvent)
    }

    processBuyEvent = (moodBoardEvent) => {
        const productConfig = (moodBoardEvent.target === `pb`) ? moodBoardEvent : this.currentConfig
        console.log(moodBoardEvent)
    }

    processMoodboardEvent = (moodBoardEvent) => {
        const productConfig = (moodBoardEvent.target === `pb`) ? moodBoardEvent : this.currentConfig
        this.requestScreenshot()

        this.setState({
            moodboardOpen: true,
        })
    }

    onOpenMoodboard = () => {
        this.setState({
            moodboardOpen: true,
        })
    }

    onCloseMoodboard = () => {
        this.setState({
            moodboardOpen: false,
        })
    }

    checkIframeLoaded = () => {
        // Get a handle to the iframe element
        var iframe = this.productbuilderRef.current;
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Check if loading is complete
        if ( iframeDoc.readyState  == 'complete' ) {
            iframe.contentWindow.onload = () => {
                this.startMoodelClient()
            };
            return;
        } 
        window.setTimeout(this.checkIframeLoaded, 100);
    }

}

ProductConfiguratorModal.propTypes = {
    className: PropTypes.string,
    product: PropTypes.object,
}

ProductConfiguratorModal.defaultProps = {
    className: '',
}


export default withTranslation()(connect(null)(ProductConfiguratorModal))
