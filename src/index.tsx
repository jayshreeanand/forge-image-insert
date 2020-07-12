import ForgeUI, {
  render,
  Text,
  Fragment,
  Image,
  useAction,
  Button,
  useState,
  useProductContext,
  IssuePanel,
} from "@forge/ui";
import api from "@forge/api";

const UNSPLASH_API_BASE_URL = "https://api.unsplash.com/";

interface UnsplashJson {
  title: string;
  url: string;
}

const fallbackDataArray = [
  {
    title: "Random",
    images: {
      fixed_height: {
        url: "https://media.giphy.com/media/Tnchbhzt4fQQM/giphy.gif",
      },
    },
  },
];

const getRandomImage = async (summary): Promise<UnsplashJson> => {
  console.log("Making Unsplash API call...");
  const uri = `${UNSPLASH_API_BASE_URL}search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${summary}`;
  const response = await api.fetch(encodeURI(uri));

  const body = await response.json();
  var dataArray = body.data;
  if (dataArray == undefined || dataArray.length == 0) {
    dataArray = fallbackDataArray;
  }
  const data = dataArray[Math.floor(Math.random() * dataArray.length)];
  const {
    title,
    images: {
      fixed_height: { url },
    },
  } = data;

  return {
    title,
    url,
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
  const context = useProductContext();
  // const summary = useState(
  //   async () => await fetchCommentsForIssue(context.platformContext.issueKey)
  // )[0];
  const [{ title, url }, setRandomImage] = useAction(
    async () => await getRandomImage("happy"),
    async () => await getRandomImage("happy")
  );

  return (
    <Fragment>
      <ImageCard src={url} title={title} />
      <Button
        text="Generate new Photo"
        onClick={() => {
          setRandomImage();
        }}
      />
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
