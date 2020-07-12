import ForgeUI, {
  render,
  Text,
  ConfigForm,
  Fragment,
  Image,
  useAction,
  Button,
  useState,
  useProductContext,
  useConfig,
  IssuePanel,
  TextField,
  Macro,
  Select,
  Option,
} from "@forge/ui";
import api from "@forge/api";

const UNSPLASH_API_BASE_URL = "https://api.unsplash.com/";

const defaultConfig = {
  searchTerm: "happy",
  size: "small",
};

interface UnsplashJson {
  alt_description: string;
  small: string;
}

const fallbackDataArray = [
  {
    alt_description: "Random",
    urls: {
      small: "https://media.giphy.com/media/Tnchbhzt4fQQM/giphy.gif",
    },
  },
];

const getRandomImage = async (summary): Promise<UnsplashJson> => {
  console.log("Making Unsplash API call...");
  console.log("env variabe");
  console.log(process.env.UNSPLASH_ACCESS_KEY);
  const uri = `${UNSPLASH_API_BASE_URL}search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${summary}`;
  const response = await api.fetch(encodeURI(uri));

  const body = await response.json();
  console.log(body);
  var dataArray = body.results;
  if (dataArray == undefined || dataArray.length == 0) {
    dataArray = fallbackDataArray;
  }
  const data = dataArray[0];
  const {
    alt_description,
    urls: { small },
  } = data;

  return {
    alt_description,
    small,
  };
};

interface ImageCardProps {
  title: string;
  src: string;
}

const ImageCard = ({ title, src }: ImageCardProps) => (
  <Fragment>
    <Image src={src} alt={title} />
  </Fragment>
);

const App = () => {
  const config = useConfig();
  const context = useProductContext();
  const [{ alt_description, small }, setRandomImage] = useAction(
    async () => await getRandomImage(config.searchTerm),
    async () => await getRandomImage(config.searchTerm)
  );

  var imageUrl;
  if (config.size == "small") {
    imageUrl = small + "&w=400";
  } else if (config.size == "medium") {
    imageUrl = small + "&w=600";
  } else if (config.size == "large") {
    imageUrl = small + "&w=800";
  } else {
    imageUrl = small + "&w=500";
  }

  return (
    <Fragment>
      <ImageCard src={imageUrl} title={alt_description} />
      {/* <Button
        text="Generate new Photo"
        onClick={() => {
          setRandomImage();
        }}
      /> */}
    </Fragment>
  );
};

const Config = () => {
  return (
    <ConfigForm>
      <TextField
        label="Search Term"
        name="searchTerm"
        defaultValue="happy"
      ></TextField>
      <Select label="Size" name="size">
        <Option label="Regular" value="regular" />
        <Option label="Small" value="small" />
        <Option label="Medium" value="medium" />
        <Option label="Large" value="large" />
      </Select>
    </ConfigForm>
  );
};

export const run = render(
  <IssuePanel>
    <Macro app={<App />} config={<Config />} defaultConfig={defaultConfig} />
  </IssuePanel>
);
