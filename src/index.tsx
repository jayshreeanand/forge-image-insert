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
  const data = dataArray[Math.floor(Math.random() * dataArray.length)];
  const {
    alt_description,
    urls: { small },
  } = data;

  return {
    alt_description,
    small,
  };
};

// const fetchCommentsForIssue = async (issueId) => {
//   const res = await api
//     .asApp()
//     .requestJira(`/rest/api/3/issue/${issueId}?fields=summary`);

//   const data = await res.json();
//   return data.fields.summary;
// };

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

  // const searchImage = async () => {
  //   if (config && config.searchTerm) {
  //     const context = useProductContext();
  //     const bodyData = [
  //       {
  //         prefix: "global",
  //         name: config.searchTerm,
  //       },
  //     ];
  //     await api
  //       .asUser()
  //       .requestConfluence(
  //         `/wiki/rest/api/content/${context.contentId}/label`,
  //         {
  //           method: "POST",
  //           body: JSON.stringify(bodyData),
  //         }
  //       );
  //   }
  // };

  // useAction(
  //   (value) => value,
  //   async () => await searchImage()
  // );

  const context = useProductContext();
  // const summary = useState(
  //   async () => await fetchCommentsForIssue(context.platformContext.issueKey)
  // )[0];
  const [{ alt_description, small }, setRandomImage] = useAction(
    async () => await getRandomImage(config.searchTerm),
    async () => await getRandomImage(config.searchTerm)
  );

  return (
    <Fragment>
      <ImageCard src={small} title={alt_description} />
      <Button
        text="Generate new Photo"
        onClick={() => {
          setRandomImage();
        }}
      />
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
