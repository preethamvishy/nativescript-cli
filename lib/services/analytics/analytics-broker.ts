import { cache } from "../../common/decorators";

export class AnalyticsBroker implements IAnalyticsBroker {

	@cache()
	private async getGoogleAnalyticsProvider(): Promise<IGoogleAnalyticsProvider> {
		const clientId = await this.$analyticsSettingsService.getClientId();
		return this.$injector.resolve("googleAnalyticsProvider", { clientId, analyticsLoggingService: this.analyticsLoggingService });
	}

	constructor(private $analyticsSettingsService: IAnalyticsSettingsService,
		private $injector: IInjector,
		private analyticsLoggingService: IAnalyticsLoggingService) { }

	public async sendDataForTracking(trackInfo: ITrackingInformation): Promise<void> {
		try {
			const googleProvider = await this.getGoogleAnalyticsProvider();
			await googleProvider.trackHit(<IGoogleAnalyticsTrackingInformation>trackInfo);
		} catch (err) {
			// So, lets ignore the error for now until we find out what to do with it.
			this.analyticsLoggingService.logData({ message: `AnalyticsBroker unable to execute action in sendDataForTracking: ${err}`, type: AnalyticsLoggingMessageType.Error });
		}
	}
}
