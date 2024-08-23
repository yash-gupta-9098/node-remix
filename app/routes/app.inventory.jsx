import {
    Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Button,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate} from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
export const loader = async ({ request }) => { 
    const { session  , admin } = await authenticate.admin(request);    
   
    try {
      
        const response = await admin.rest.resources.InventoryLevel.all({
            session: session,
            location_ids:"73774235922"
        });
        console.log(response , "response");
      if (response) {
        console.log(response)
        const data =  response.data;
        console.log(data , "data")
        
        return null;       
      }
  
      return null;
  
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  

  export default function inventoryPage() {
    const { data } = useLoaderData();
    console.log(data);    
  
    return (
      <Page>
        <TitleBar title="inventory" />
        <Layout>
          <Layout.Section>
            <Card>
             <Text>inventory data</Text>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              
                <Text as="h2" variant="headingMd">
                  Resources
                </Text>
                <List>
                  <List.Item>
                    <Link
                      url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                      target="_blank"
                      removeUnderline
                    >
                      App nav best practices
                    </Link>
                  </List.Item>
                </List>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      );
    }
  