import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { ErrorMessage } from "@hookform/error-message";
import { useButtonForm } from "@/hooks/customize/use-customize";
import ColorSelector from "@/components/dashboard/Customize/color/Selector";
import { Input } from "@/components/ui/input";

const ButtonForm = () => {
  const {
    loading,
    register,
    errors,
    setValue,
    watch,
    handleCustomizeButton,
    localLogo,
  } = useButtonForm();

  const buttonBackground = watch("buttonBackground");
  const buttonFullBg = watch("buttonFullBg");
  const useCustomButton = watch("useCustomButton");

  return (
    <Card className="w-full px-5">
      <CardContent className="p-6">
        <CardTitle className="text-lg lg:text-2xl md:text-lg font-bold mb-6">
          Button Customize
        </CardTitle>
        
        <Loader loading={loading}>
          <form onSubmit={handleCustomizeButton} className="space-y-6">
            {/* Use Custom Button Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useCustomButton"
                checked={useCustomButton}
                onCheckedChange={(checked) => {
                  setValue("useCustomButton", checked as boolean)
                }}
              />
              <Label
                htmlFor="useCustomButton"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use Custom Button Style
              </Label>
            </div>

            {useCustomButton && (
              <>
                {/* Upload Button Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 items-center">
                    <Label
                      htmlFor="upload-button"
                      className="flex gap-2 p-3 rounded-lg bg-gray-100 text-gray-600 cursor-pointer font-semibold text-sm items-center"
                    >
                      <Input
                        {...register("buttonImage")}
                        className="hidden"
                        type="file"
                        id="upload-button"
                        accept="image/*"
                      />
                      {localLogo ? "Change Icon" : "Add Icon"}
                    </Label>
                    <p className="text-sm text-gray-400 ml-6">
                      Recommended size is 300px * 300px, size less than 2MB
                    </p>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="buttonImage"
                    render={({ message }) => (
                      <p className="text-red-400">{message}</p>
                    )}
                  />
                </div>

                {/* Preview Section */}
                <div className="flex gap-4 items-center">
                  {/* Closed Button Preview */}
                  <div
                    style={{ 
                      backgroundColor: buttonBackground,
                      ...(buttonFullBg && localLogo && {
                        backgroundImage: `url(${localLogo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      })
                    }}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {!buttonFullBg && localLogo ? (
                      <Image
                        src={localLogo}
                        alt="Button Icon"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    ) : !localLogo && (
                      <MessageSquare className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Open Button Preview */}
                  <div
                    style={{ 
                      backgroundColor: buttonFullBg ? buttonBackground : 'white',
                      border: !buttonFullBg ? `2px solid ${buttonBackground}` : 'none'
                    }}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-200"
                  >
                    <X 
                      className={`w-6 h-6 ${buttonFullBg ? 'text-white' : ''}`}
                      style={{ color: !buttonFullBg ? buttonBackground : undefined }}
                    />
                  </div>
                </div>

                {/* Color and Full Background Checkbox Section */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <ColorSelector 
                      element={{
                        label: "Button Color",
                        name: "buttonBackground"
                      }}
                      watch={watch}
                      register={register}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="buttonFullBg"
                      checked={buttonFullBg}
                      onCheckedChange={(checked:boolean) => {
                        setValue("buttonFullBg", checked);
                      }}
                    />
                    <Label
                      htmlFor="buttonFullBg"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Full Background
                    </Label>
                  </div>
                </div>
              </>
            )}

            <Button 
              type="submit"
              className="bg-[#06b6d4] hover:bg-[#06b6d4] hover:opacity-70 transition duration-150 ease-in-out text-white font-semibold w-full"
            >
              Save Changes
            </Button>
          </form>
        </Loader>
      </CardContent>
    </Card>
  );
};

export default ButtonForm;
