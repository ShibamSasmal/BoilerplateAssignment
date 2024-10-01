import { AssTemplatePage } from './app.po';

describe('Ass App', function() {
  let page: AssTemplatePage;

  beforeEach(() => {
    page = new AssTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
