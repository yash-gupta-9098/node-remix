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
import { authenticate  , apiVersion } from "../shopify.server";
import { useLoaderData, useNavigate } from "@remix-run/react";
  
export const query = `
  query Products($afterCursor: String) {
    products(first: 10, after: $afterCursor) {
      edges {
        node {
          id
          title
          vendor
          status
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;



export const loader = async ({ request }) => { 
    const { session } = await authenticate.admin(request);
    const { shop, accessToken } = session;
  
    const url = new URL(request.url);
    const afterCursor = url.searchParams.get("afterCursor") || null; // Get the cursor from the URL if present
  
    const queryWithVariables = JSON.stringify({
      query: query,
      variables: {
        afterCursor: afterCursor
      }
    });
  
    try {
      const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // GraphQL API expects JSON format
          "X-Shopify-Access-Token": accessToken
        },
        body: queryWithVariables // Pass the query and variables
      });
  
      if (response.ok) {
        const data = await response.json();
        const { products } = data.data;
  
        return {
          products,
          hasNextPage: products.pageInfo.hasNextPage,
          endCursor: products.pageInfo.endCursor
        };
      }
  
      return null;
  
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  

  export default function ProductsPage() {
    const { products, hasNextPage, endCursor } = useLoaderData();
    const navigate = useNavigate();
  
    const handleLoadMore = () => {
      if (hasNextPage) {
        // Navigate to the same route but with the updated `afterCursor` parameter
        navigate(`?afterCursor=${endCursor}`);
      }
    };
  
    return (
      <Page>
        <TitleBar title="Products" />
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                {products.edges.map(({ node }) => (
                  <Text as="p" key={node.id} variant="bodyMd">
                    {node.title} - {node.vendor} - {node.status}
                  </Text>
                ))}
  
                {hasNextPage && (
                  <Button onClick={handleLoadMore}>Load More Products</Button>
                )}
              </BlockStack>
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
  