class TickerModel {
  constructor(
    public name: string,
    public company: string,
    public industry: string,
    public sectorId: number,
    public countryId: number,
    public company_url: string,
    public listing_exchange: string,
    public currency: string,
    public market_cap: number,
    public share_in_issue: number,
    public fiftytwo_week_high: number,
    public fiftytwo_week_low: number,
    public avg_volume: number,
    public about: string,
    public createdBy: string,
    public updatedBy: string,
    public id?: number
  ) { }
}
class FormTickerModel {
  constructor(
    public name: string,
    public company: string,
    public industry: string,
    public sectorId: number,
    public countryId: number,
    public company_url: string,
    public listing_exchange: string,
    public currency: string,
    public market_cap: number,
    public share_in_issue: number,
    public fiftytwo_week_high: number,
    public fiftytwo_week_low: number,
    public avg_volume: number,
    public about: string,
    public createdBy: string,
    public updatedBy: string
  ) { }
}

export { TickerModel, FormTickerModel };