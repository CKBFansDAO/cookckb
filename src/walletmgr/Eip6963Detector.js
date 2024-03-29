class Eip6963Detector {
    static instance = null;
    providerDetails = [];

    constructor() {
        if (Eip6963Detector.instance) {
            return Eip6963Detector.instance;
        }
        Eip6963Detector.instance = this;

        this.detectEip6963();
    }

    existsProviderDetail = (newProviderDetail) => {
        const existingProvider = this.providerDetails.find(
            (providerDetail) =>
                providerDetail.info &&
                newProviderDetail.info &&
                providerDetail.info.uuid === newProviderDetail.info.uuid,
        );

        if (existingProvider) {
            return true;
        }
        return false;
    };

    handleNewProviderDetail = (newProviderDetail) => {
        if (this.existsProviderDetail(newProviderDetail)) {
            return;
        }

        this.providerDetails.push(newProviderDetail);
    };

    detectEip6963 = () => {
        window.addEventListener('eip6963:announceProvider', (event) => {
            if (event.detail.info.uuid) {
                this.handleNewProviderDetail(event.detail);
            }
        });

        window.dispatchEvent(new Event('eip6963:requestProvider'));
    };

    getProviderDetails = () => {
        return this.providerDetails;
    };
}

const eip6963Detector = new Eip6963Detector();
export default eip6963Detector;
