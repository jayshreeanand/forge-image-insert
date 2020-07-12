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
} from "@forge/ui";
import api from "@forge/api";

const UNSPLASH_API_BASE_URL = "https://api.unsplash.com/";

const defaultConfig = {
  searchTerm: "happy",
};

interface UnsplashJson {
  alt_description: string;
  regular: string;
}

const fallbackDataArray = [
  {
    alt_description: "Random",
    urls: {
      regular: "https://media.giphy.com/media/Tnchbhzt4fQQM/giphy.gif",
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
    urls: { regular },
  } = data;

  return {
    alt_description,
    regular,
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
  const [{ alt_description, regular }, setRandomImage] = useAction(
    async () => await getRandomImage(config.searchTerm),
    async () => await getRandomImage(config.searchTerm)
  );

  return (
    <Fragment>
      <ImageCard src={regular} title={alt_description} />
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
    </ConfigForm>
  );
};

export const run = render(
  <IssuePanel>
    <Macro app={<App />} config={<Config />} defaultConfig={defaultConfig} />
  </IssuePanel>
);
