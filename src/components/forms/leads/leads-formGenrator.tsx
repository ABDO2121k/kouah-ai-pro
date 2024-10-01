"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import FormGenerator from "@/components/form-generator";
import { useCreateLeads } from "../../../hooks/leads/use-create-leads";

const LeadsFormGenerator = () => {
  const {
    loading,
    leadFields,
    newField,
    errors,
    register,
    handleToggleRequired,
    handleDeleteField,
    handleAddField,
    handleSaveChanges,
    handleToggleEdit,
    handleEditFieldName,
    setNewField,
  } = useCreateLeads();

  return (
    <Card className="w-full px-5">
      <CardContent className="p-6">
        <form onSubmit={handleSaveChanges}>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-lg lg:text-2xl md:text-lg font-bold">
              Leads Customize 
            </CardTitle>
          </div>

          <div className="w-full lg:w-3/5 xl:w-7/10 mx-auto space-y-4">
            <FormGenerator
              type="text"
              inputType="input"
              label="Leads Title"
              placeholder="Leads Title"
              register={register}
              name="leadsTitle"
              errors={errors}
            />

            <div className="flex items-center justify-between font-semibold">
              <span className="w-1/3">Field Name</span>
              <span className="w-1/3 text-center">Required</span>
              <span className="w-1/3 text-right">Actions</span>
            </div>
            {leadFields.map((field) => (
              <div key={field.id} className="flex items-center justify-between">
                <Input
                  className="w-1/3"
                  value={field.fieldName}
                  readOnly={!field.isEditing}
                  onChange={(e) =>
                    handleEditFieldName(field.id, e.target.value)
                  }
                />
                <div className="w-1/3 flex justify-center">
                  <Switch
                    checked={field.required}
                    onCheckedChange={() => handleToggleRequired(field.id)}
                  />
                </div>
                <div className="w-1/3 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleToggleEdit(field.id)}
                  >
                    {field.isEditing ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 w-full lg:w-3/5 xl:w-7/10 mx-auto flex items-center justify-between">
            <Input
              className="w-1/3"
              placeholder="New field name"
              value={newField.fieldName}
              onChange={(e) =>
                setNewField({ ...newField, fieldName: e.target.value })
              }
            />
            <div className="w-1/3 flex justify-center">
              <Switch
                checked={newField.required}
                onCheckedChange={(checked) =>
                  setNewField({ ...newField, required: checked })
                }
              />
            </div>
            <div className="w-1/3 flex justify-end">
              <Button type="button" onClick={handleAddField} disabled={loading}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadsFormGenerator;
