import { Banner, Layout } from "@shopify/polaris";

type BannerProps = {
  showBanner: boolean;
};

const Banners = ({ showBanner }: BannerProps) => {
  if (showBanner) {
    return (
      <Layout.Section>
        <Banner
          title="You have successfully nominated 5 movies."
          status="success"
        />
      </Layout.Section>
    );
  }
  return null;
};

export default Banners;
