import { AstroInfoPage } from './app.po';

describe('astro-info App', function() {
  let page: AstroInfoPage;

  beforeEach(() => {
    page = new AstroInfoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
